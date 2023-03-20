# Generated by Django 4.1.7 on 2023-03-09 18:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('biosignalsindex', '0003_alter_sociodramasession_thematic'),
    ]

    operations = [
        migrations.RenameField(
            model_name='axis',
            old_name='description',
            new_name='title',
        ),
        migrations.AddField(
            model_name='episode',
            name='episode_id_in_session',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='axis',
            name='thematic',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='axes', to='biosignalsindex.thematicunit'),
        ),
        migrations.AlterField(
            model_name='episode',
            name='axis',
            field=models.ManyToManyField(related_name='episodes', to='biosignalsindex.axis'),
        ),
        migrations.AlterField(
            model_name='episode',
            name='session',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='episodes', to='biosignalsindex.sociodramasession'),
        ),
        migrations.AlterField(
            model_name='participant',
            name='session',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='biosignalsindex.sociodramasession'),
        ),
    ]