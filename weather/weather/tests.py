from django.test import TestCase, RequestFactory
from .views import get_weather


class QueryTestCase(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def test_query_by_city_name(self):
        request = self.factory.post('', {'city-name': 'Novosibirsk', 'country-code': ''})
        response = get_weather(request)
        self.assertEqual(response.status_code, 200)
        request = self.factory.post('', {'city-name': 'Novosibirsk', 'country-code': 'ru'})
        response = get_weather(request)
        self.assertEqual(response.status_code, 200)

    def test_query_by_city_id(self):
        request = self.factory.post('', {'city-id': '1496747'})
        response = get_weather(request)
        self.assertEqual(response.status_code, 200)
        request = self.factory.post('', {'city-id': '1496747', 'city-id-1': '1489425', 'city-id-2': '1503901'})
        response = get_weather(request)
        self.assertEqual(response.status_code, 200)

    def test_query_by_geographic_coordinates(self):
        request = self.factory.post('', {'latitude': '55.03', 'longitude': '82.92'})
        response = get_weather(request)
        self.assertEqual(response.status_code, 200)

    def test_query_by_zip_code(self):
        request = self.factory.post('', {'zip-code': '630000', 'country-code': ''})
        response = get_weather(request)
        self.assertEqual(response.status_code, 200)
        request = self.factory.post('', {'zip-code': '630000', 'country-code': 'ru'})
        response = get_weather(request)
        self.assertEqual(response.status_code, 200)

    def test_query_by_rectangle_zone(self):
        request = self.factory.post('', {
            'longitude-left': '82.92',
            'latitude-bottom': '55.03',
            'longitude-right': '84.95',
            'latitude-top': '56.49',
            'zoom': '10'
        })
        response = get_weather(request)
        self.assertEqual(response.status_code, 200)

    def test_query_by_cycle_zone(self):
        request = self.factory.post('', {'latitude': '55.03', 'longitude': '82.92', 'count': '10'})
        response = get_weather(request)
        self.assertEqual(response.status_code, 200)