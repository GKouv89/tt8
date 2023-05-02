# Generated by Django 4.1.7 on 2023-05-02 18:31

from django.db import migrations

def change_colors(apps, schema_editor):
    axis_colors_dict = {
        1: '#FA2410',
        2: '#F99300',
        3: '#FCE520',
        4: '#62AA2D',
        5: '#038CCA',
        6: '#002789',
        7: '#8400AB',
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