# Generated by Django 3.1.4 on 2021-01-24 09:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0006_auto_20210123_2134'),
    ]

    operations = [
        migrations.AlterField(
            model_name='thread',
            name='subject',
            field=models.CharField(default=None, max_length=255, verbose_name='Subject'),
        ),
    ]
