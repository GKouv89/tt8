# Generated by Django 4.1.7 on 2023-03-12 11:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('biosignalsindex', '0005_alter_participantmaterial_biosignal_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='participant',
            old_name='participant_id_in_session',
            new_name='sensor_id_in_session',
        ),
    ]