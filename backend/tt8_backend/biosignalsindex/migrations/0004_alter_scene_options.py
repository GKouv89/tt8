# Generated by Django 4.1.7 on 2023-07-19 11:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('biosignalsindex', '0003_orderedscenesinaxis'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='scene',
            options={'ordering': ['session__session_id_in_thematic', 'scene_id_in_session']},
        ),
    ]
