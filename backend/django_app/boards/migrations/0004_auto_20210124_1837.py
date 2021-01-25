# Generated by Django 3.1.4 on 2021-01-24 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0003_post_replyto'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='text',
            field=models.TextField(blank=True, default=None, max_length=40000, verbose_name='Text'),
        ),
        migrations.AlterField(
            model_name='thread',
            name='text',
            field=models.TextField(blank=True, default=None, max_length=40000, null=True, verbose_name='Text'),
        ),
    ]