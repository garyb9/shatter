# Generated by Django 3.1.4 on 2021-01-21 22:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0003_auto_20210122_0024'),
    ]

    operations = [
        migrations.RenameField(
            model_name='board',
            old_name='file_name',
            new_name='fileName',
        ),
    ]