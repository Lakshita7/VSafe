# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2019-06-02 03:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0003_auto_20190602_0844'),
    ]

    operations = [
        migrations.AddField(
            model_name='area',
            name='user1',
            field=models.CharField(default=2, max_length=200),
            preserve_default=False,
        ),
    ]
