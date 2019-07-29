FROM python:3
RUN mkdir /home/django
RUN mkdir /home/django/weather
WORKDIR /home/django/weather
ADD . /home/django/weather
RUN pip3 install --upgrade pip
RUN pip3 install -r /home/django/weather/requirements.txt
RUN python3 manage.py migrate