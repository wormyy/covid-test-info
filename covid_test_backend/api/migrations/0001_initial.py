# Generated by Django 3.0.5 on 2020-04-04 13:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TestResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('executed_at', models.DateField(verbose_name='day month and year the test was executed')),
                ('hash', models.BinaryField(verbose_name=60)),
                ('result', models.BooleanField()),
            ],
        ),
    ]
