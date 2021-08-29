from urllib.parse import parse_qs
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 3
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Parse query_string
        query_params = parse_qs(scope["query_string"].decode())
        if query_params['token']:
            token_key = query_params['token'][0]
            scope['user'] = await self.get_user_with_token(token_key)

        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user_with_token(self, token_key):
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
        except Token.DoesNotExist:
            user = AnonymousUser()

        return user

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
