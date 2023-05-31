# Generated by Django 4.1.7 on 2023-05-02 18:31

from django.db import migrations

def change_colors(apps, schema_editor):
    # axis_colors_dict = {
    #     1: '#fb6e61',
    #     2: '#fcc26e',
    #     3: '#fdfc70',
    #     4: '#a3d184',
    #     5: '#bfeaf5',
    #     6: '#425fa8',
    #     7: '#b667cd',
    #     8: '#FFFFFF'
    # }
    axis_colors_dict = {
        1: '#EE3124',
        2: '#F58220',
        3: '#FFF203',
        4: '#0099DA',
        5: '#6F2C91',
        6: '#55B047',
        7: '#005BAA',
        8: '#FFFFFF'
    }
    Axis = apps.get_model('biosignalsindex', 'Axis')
    for axis in Axis.objects.all():
        axis.color = axis_colors_dict[axis.axis_id_in_thematic]
        axis.save()

class Migration(migrations.Migration):

    dependencies = [
        ('biosignalsindex', '0008_episode_is_superepisode'),
    ]

    operations = [
        migrations.RunPython(change_colors),
    ]
