# Generated by Django 5.0.6 on 2024-07-22 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quisition', '0004_alter_quisition_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quisition',
            name='created_at',
            field=models.DateField(auto_now_add=True),
        ),
    ]
