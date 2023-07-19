# Generated by Django 4.1.7 on 2023-07-14 17:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Axis',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('axis_id_in_thematic', models.IntegerField()),
                ('title', models.TextField()),
                ('color', models.CharField(max_length=7)),
            ],
        ),
        migrations.CreateModel(
            name='Biometric',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=16, unique=True)),
                ('abbr', models.CharField(max_length=4, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Scene',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_superepisode', models.BooleanField(default=True)),
                ('scene_id_in_session', models.IntegerField()),
                ('axis', models.ManyToManyField(related_name='scenes', to='biosignalsindex.axis')),
            ],
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32)),
            ],
        ),
        migrations.CreateModel(
            name='SociodramaSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_id_in_thematic', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='ThematicUnit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_no_in_section', models.IntegerField()),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='biosignalsindex.section')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='%(class)s', to='biosignalsindex.sociodramasession')),
            ],
        ),
        migrations.AddField(
            model_name='sociodramasession',
            name='thematic',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sessions', to='biosignalsindex.thematicunit'),
        ),
        migrations.AddField(
            model_name='section',
            name='session',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sections', to='biosignalsindex.sociodramasession'),
        ),
        migrations.CreateModel(
            name='SceneInTaskMetadata',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_order', models.IntegerField()),
                ('starting_row', models.IntegerField()),
                ('ending_row', models.IntegerField()),
                ('starting_time', models.FloatField()),
                ('ending_time', models.FloatField()),
                ('scene', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meta', to='biosignalsindex.scene')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meta', to='biosignalsindex.task')),
            ],
        ),
        migrations.AddField(
            model_name='scene',
            name='session',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='%(class)s', to='biosignalsindex.sociodramasession'),
        ),
        migrations.AddField(
            model_name='scene',
            name='task',
            field=models.ManyToManyField(related_name='scenes', through='biosignalsindex.SceneInTaskMetadata', to='biosignalsindex.task'),
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sensor_id_in_session', models.IntegerField()),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='biosignalsindex.sociodramasession')),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=512)),
                ('participant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to='biosignalsindex.participant')),
                ('scene', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='biosignalsindex.scene')),
                ('task', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='biosignalsindex.task')),
            ],
        ),
        migrations.CreateModel(
            name='BioPeakMetadata',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('biometric', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scene_peaks_meta', to='biosignalsindex.biometric')),
                ('participant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scene_peaks_meta', to='biosignalsindex.participant')),
                ('scene', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='peak_meta', to='biosignalsindex.scene')),
            ],
        ),
        migrations.CreateModel(
            name='BiometricMetadataForTask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('min_value', models.FloatField()),
                ('max_value', models.FloatField()),
                ('biometric', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks_meta', to='biosignalsindex.biometric')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bio_meta', to='biosignalsindex.task')),
            ],
        ),
        migrations.AddField(
            model_name='biometric',
            name='scene_peaks',
            field=models.ManyToManyField(related_name='peak_metadata', through='biosignalsindex.BioPeakMetadata', to='biosignalsindex.scene'),
        ),
        migrations.AddField(
            model_name='biometric',
            name='tasks',
            field=models.ManyToManyField(related_name='bio_metadata', through='biosignalsindex.BiometricMetadataForTask', to='biosignalsindex.task'),
        ),
        migrations.AddField(
            model_name='axis',
            name='thematic',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='axes', to='biosignalsindex.thematicunit'),
        ),
        migrations.AddConstraint(
            model_name='task',
            constraint=models.UniqueConstraint(fields=('section', 'task_no_in_section'), name='unique_section_task'),
        ),
        migrations.AddConstraint(
            model_name='sociodramasession',
            constraint=models.UniqueConstraint(fields=('thematic', 'session_id_in_thematic'), name='unique_thematic_session'),
        ),
        migrations.AddConstraint(
            model_name='section',
            constraint=models.UniqueConstraint(fields=('session', 'name'), name='unique_session_section'),
        ),
        migrations.AddConstraint(
            model_name='scene',
            constraint=models.UniqueConstraint(fields=('session', 'scene_id_in_session'), name='unique_session_scene'),
        ),
        migrations.AddConstraint(
            model_name='participant',
            constraint=models.UniqueConstraint(fields=('session', 'sensor_id_in_session'), name='unique_session_sensor'),
        ),
        migrations.AddConstraint(
            model_name='file',
            constraint=models.CheckConstraint(check=models.Q(('task__isnull', False), ('scene__isnull', False), _connector='XOR'), name='one_of_two_not_null'),
        ),
        migrations.AddConstraint(
            model_name='axis',
            constraint=models.UniqueConstraint(fields=('thematic', 'axis_id_in_thematic'), name='unique_thematic_axis'),
        ),
    ]
