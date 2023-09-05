# Generated by Django 4.1.7 on 2023-08-28 15:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('biosignalsindex', '0006_remove_sceneintaskmetadata_ending_time_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='BiometricMetadataForScene',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('min_value', models.FloatField()),
                ('max_value', models.FloatField()),
                ('biometric', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scenes_meta', to='biosignalsindex.biometric')),
                ('scene', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bio_meta', to='biosignalsindex.scene')),
            ],
        ),
    ]