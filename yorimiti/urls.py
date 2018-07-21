from django.conf.urls import url
from project.routers import HybridRouter
from yorimiti.views import *

# We use a single global DRF Router that routes views from all apps in project
router = HybridRouter()

# app views and viewsets
# router.register(r'search', YorimitiViewSet, r"search")

yorimiti_list = YorimitiViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
yorimiti_detail = YorimitiViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})
yorimiti_search = YorimitiViewSet.as_view({
    'get': 'search',
})

urlpatterns = [
    # project配下のurls.pyと紐づいている
    # ?P<対象カラム>でそのあとの正規表現を紐づけている模様

    url(r'^top/', top_view.as_view(), name='top'),
    url(r'^api/$', yorimiti_list, name='yorimiti-list'),
    url(r'^api/(?P<sub_category_name>[ぁ-んァ-ヴー－]+)/$', yorimiti_detail, name='yorimiti-detail'),
    url(r'^api/([0-9a-z]+)/search', yorimiti_search, name='search'),
]