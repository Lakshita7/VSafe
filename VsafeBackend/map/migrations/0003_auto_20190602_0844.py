# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2019-06-02 03:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0002_area_no_of_people'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='area',
            name='no_of_people',
        ),
        migrations.AlterField(
            model_name='area',
            name='rating',
            field=models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')]),
        ),
    ]
