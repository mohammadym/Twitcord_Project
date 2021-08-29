from twitcord_app.serializers import (
    RoomMessageSerializer,
)


class WSRoomMessageSerializer(RoomMessageSerializer):
    def get_is_sent_by_me(self, obj):
        return bool(self.context['scope']['user'] == obj.sender)
