from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import AnonymousUser

from .serializers import (
    WSRoomMessageSerializer,
)

from twitcord_app.models import RoomMessage


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive_json(self, content, **kwargs):
        message = content['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send_json(content={
            'message': message
        })


class RoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'room_{self.room_id}'

        if isinstance(self.scope['user'], AnonymousUser):
            print("No authorize, add token in query string")
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive_json(self, content, **kwargs):
        message = content['message']
        sender = self.scope['user']

        # save message in database
        room_message = await self.create_room_message(message, sender.id, self.room_id)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'room_message_id': room_message.id
            }
        )

    # Create new RoomMessage object
    @database_sync_to_async
    def create_room_message(self, content, sender_id, room_id):
        obj = RoomMessage.objects.create(
            sender_id=sender_id,
            room_id=room_id,
            content=content
        )
        return obj

    # Deserialize RoomMessage object
    @database_sync_to_async
    def deserialize_room_message(self, room_message):
        deserialized_message = WSRoomMessageSerializer(
            instance=room_message,
            context={'scope': self.scope}
        ).data
        return deserialized_message

    # get RoomMessage object from database
    @database_sync_to_async
    def get_room_message(self, id):
        return get_object_or_404(RoomMessage, id=id)

    # Receive message from room group
    async def chat_message(self, event):
        room_message_id = event['room_message_id']
        room_message = await self.get_room_message(room_message_id)
        des_room_message = await self.deserialize_room_message(room_message)

        # Send message to WebSocket
        content = {
            'message': des_room_message
        }
        await self.send_json(content=content)
