import requests
import re

from django.http import HttpResponse, JsonResponse
from django.template import loader
from . import forms
from . import models


def index(request):
    fields = models.Field.objects.all()
    for field in fields:
        field.delete()
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))


def get_weather(request):
    template = loader.get_template('weather.html')
    if request.method == 'POST':
        form = forms.TextInputs(request.POST, request.FILES)
        if form.is_valid():
            res = 'Некорректные данные для определения погоды.'
            if 'city-name' in request.POST:
                response = requests.get(
                    f'http://api.openweathermap.org/data/2.5/weather?q={request.POST["city-name"]},{request.POST["country-code"]}&APPID=67f507a36acac387ebd6b66cb57c0fa5'
                    if request.POST['country-code'] != '' else
                    f'http://api.openweathermap.org/data/2.5/weather?q={request.POST["city-name"]}&APPID=67f507a36acac387ebd6b66cb57c0fa5'
                )
                res = response.json()
            elif 'city-id' in request.POST:
                fields = models.Field.objects.all()
                for field in fields:
                    field.delete()
                id = request.POST['city-id']
                for k, v in request.POST.items():
                    r = re.fullmatch(r'city-id-(?P<id>\d+)', k)
                    if r is not None and re.fullmatch(r'\d+', v):
                        id += ',' + v
                        field = models.Field()
                        field.id = r.group('id')
                        field.val = int(v)
                        field.save()
                response = requests.get(
                    f'http://api.openweathermap.org/data/2.5/weather?id={request.POST["city-id"]}&APPID=67f507a36acac387ebd6b66cb57c0fa5'
                    if id == request.POST["city-id"] else
                    f'http://api.openweathermap.org/data/2.5/group?id={id}&APPID=67f507a36acac387ebd6b66cb57c0fa5'
                )
                res = response.json()
            elif all(key in request.POST for key in ['latitude', 'longitude']) and 'count' not in request.POST:
                response = requests.get(
                    f'http://api.openweathermap.org/data/2.5/weather?lat={request.POST["latitude"]}&lon={request.POST["longitude"]}&APPID=67f507a36acac387ebd6b66cb57c0fa5'
                )
                res = response.json()
            elif 'zip-code' in request.POST:
                response = requests.get(
                    f'http://api.openweathermap.org/data/2.5/weather?zip={request.POST["zip-code"]},{request.POST["country-code"]}&APPID=67f507a36acac387ebd6b66cb57c0fa5'
                    if request.POST['country-code'] != '' else
                    f'http://api.openweathermap.org/data/2.5/weather?zip={request.POST["zip-code"]}&APPID=67f507a36acac387ebd6b66cb57c0fa5'
                )
                res = response.json()
            elif all(key in request.POST for key in ['longitude-left', 'latitude-bottom', 'longitude-right', 'latitude-top', 'zoom']):
                response = requests.get(
                    f'http://api.openweathermap.org/data/2.5/box/city?bbox={request.POST["longitude-left"]},{request.POST["latitude-bottom"]},{request.POST["longitude-right"]},{request.POST["latitude-top"]},{request.POST["zoom"]}&APPID=67f507a36acac387ebd6b66cb57c0fa5'
                )
                res = response.json()
                if response.status_code == 200:
                    if 'list' in res:
                        for city in res['list']:
                            city['main']['temp'] += 273.15
                    else:
                        return HttpResponse(template.render({
                            'status': 'error',
                            'result': 'Не найдено ни одного города в данном прямоугольнике.'
                        }, request))
            elif all(key in request.POST for key in ['latitude', 'longitude', 'count']):
                response = requests.get(
                    f'http://api.openweathermap.org/data/2.5/find?lat={request.POST["latitude"]}&lon={request.POST["longitude"]}&cnt={request.POST["count"]}&APPID=67f507a36acac387ebd6b66cb57c0fa5'
                )
                res = response.json()
                if response.status_code != 200:
                    return HttpResponse(template.render({
                        'status': 'error',
                        'result': 'Не найдено ни одного города, либо превышен лимит по количеству городов в заданном радиусе (более 50).'
                    }, request))
            return HttpResponse(template.render({
                'status': 'success',
                'result': res
            }, request))
        else:
            return HttpResponse(template.render({
                'status': 'error',
                'result': 'Не валидные поля формы.'
            }, request))
    return HttpResponse(template.render({
        'status': 'error',
        'result': 'Не валидный метод отправки формы. Ожидается метод POST.'
    }, request))


def get_fields(request):
    fields = models.Field.objects.all()
    res = []
    for field in fields:
        res.append({'k': field.id, 'v': field.val})
    return JsonResponse({'fields': res})
