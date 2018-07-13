from django.conf.urls import url
from project.routers import HybridRouter
from yorimiti.views import *

# We use a single global DRF Router that routes views from all apps in project
router = HybridRouter()

# app views and viewsets
# router.register(r'search', YorimitiViewSet, r"search")

urlpatterns = [
    # project配下のurls.pyと紐づいている
    url(r'^top/', top_view.as_view(), name='top'),
    # ?P<対象カラム>でそのあとの正規表現を紐づけている模様
    url(r'^search/(?P<sub_category_name>[ぁ-んァ-ヴー－]+)/$', YorimitiViewSet.as_view({'get': 'retrieve'}), name='search'),
    url(r'^radio_search/(?P<category_name>[ぁ-んァ-ヴー－]+)', RadioViewSet.as_view({'get': 'list'}), name='list'),
]