# Generated by Django 4.1.7 on 2023-03-09 18:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('biosignalsindex', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Session',
            new_name='SociodramaSession',
        ),
    ]