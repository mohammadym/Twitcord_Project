from rest_framework.pagination import PageNumberPagination


class MyPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200
    last_page_strings = ('the_end',)


class RoomMessagesPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    page_size = 50


class RoomListPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    page_size = 50
