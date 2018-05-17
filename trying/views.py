from __future__ import unicode_literals

from django.template.response import TemplateResponse

from app.serializers import *
from app.models import Book
from django.http import HttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def apiTest_book(request):
    """
    http://sandmark.hateblo.jp/entry/2017/09/30/160945を参考にして
    rest frameworkを利用しないでapiの確認を行う
    """
    if request.method == 'GET':
        book = Book.objects.all()
        serializer = BookSerializer(book, many=True)
        # 文字化けしたのでutf8に変換する
        return HttpResponse(json.dumps(serializer.data, ensure_ascii=False), content_type="application/json")
        #return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = Book(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)



from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.views import APIView

class BookList(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'test_list.html'

    def get(self, request):
        queryset = Book.objects.all()
        return Response({'books': queryset})

class BookDetail(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'test_detail.html'

    def get(self, request):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book)
        return Response({'serializer': serializer, 'book': book})

    def post(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, data=request.data)
        if not serializer.is_valid():
            return Response({'serializer': serializer, 'profile': book})
        serializer.save()
        return redirect('book-list')