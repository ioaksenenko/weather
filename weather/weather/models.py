import json

from django.db import models


class Field(models.Model):
    id = models.IntegerField(
        primary_key=True,
    )
    val = models.IntegerField()

    def __str__(self):
        return json.dumps({'id': self.id, 'val': self.val})
