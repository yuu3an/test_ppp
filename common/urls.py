from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import include, url
from django.contrib import admin

from users.views import *
from yorimichi.views import *

from common.routers import HybridRouter


# We use a single global DRF Router that routes views from all apps in common
router = HybridRouter()

# app views and viewsets
router.register(r'tool', ToolViewSet, r"tool")
router.register(r'user', UserViewSet, r"user")
router.register(r'M_Category', MCategoryViewSet, r"M_Category")
router.register(r'T_User_Category', TUserCategoryViewSet, r"T_User_Category")

urlpatterns = [
    # default django admin interface (currently unused)
    url(r'^admin/', include(admin.site.urls)),

    # root view of our REST api, generated by Django REST Framework's router
    url(r'^api/', include(router.urls, namespace='api')),

    # index page should be served by django to set cookies, headers etc.
    url(r'^$', index_view, {}, name='index'),

    # include() 関数は他の URLconf への参照することができます。
    # Django が include() に遭遇すると、そのポイントまでに一致した URL の部分を切り落とし、
    # 次の処理のために残りの文字列をインクルードされた URLconf へ渡します。
    # https://docs.djangoproject.com/ja/2.0/intro/tutorial01/

    # yorimichiプロジェクトへ
    url(r'yorimichi/', include('yorimichi.urls')),

    # sampleプロジェクトへ
    url(r'sample/', include('sample.urls')),
]

# let django built-in server serve static and media content
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
