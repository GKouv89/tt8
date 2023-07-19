# Generated by Django 4.1.7 on 2023-07-19 11:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('biosignalsindex', '0002_alter_biopeakmetadata_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderedScenesInAxis',
            fields=[
            ],
            options={
                'ordering': ['axis__thematic', 'axis__axis_id_in_thematic', 'scene__session__session_id_in_thematic', 'scene__scene_id_in_session'],
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('biosignalsindex.scene_axis',),
        ),
    ]
