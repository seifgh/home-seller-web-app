# Generated by Django 3.0.4 on 2020-05-25 10:01

from django.conf import settings
import django.contrib.postgres.indexes
import django.contrib.postgres.search
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email address')),
                ('full_name', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('type', models.CharField(choices=[('ag', 'Agent'), ('cl', 'Client'), ('us', 'User')], default='cl', max_length=2)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Agent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=254)),
                ('birth', models.DateField()),
                ('phone', models.CharField(max_length=30)),
                ('address', models.CharField(max_length=100)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('latitude', models.DecimalField(decimal_places=8, max_digits=15)),
                ('longitude', models.DecimalField(decimal_places=8, max_digits=15)),
                ('postal_code', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=30)),
                ('details', models.TextField(blank=True, max_length=10000, null=True)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=2)),
                ('name', models.CharField(max_length=100)),
                ('currency', models.CharField(max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(blank=True)),
                ('image', models.ImageField(blank=True, upload_to='images')),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=50)),
                ('latitude', models.DecimalField(decimal_places=8, max_digits=15, null=True)),
                ('longitude', models.DecimalField(decimal_places=8, max_digits=15, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Owner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=30)),
                ('message', models.TextField(blank=True, max_length=10000, null=True)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True, max_length=500, null=True)),
                ('build_year', models.PositiveIntegerField(default=0)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('property_type', models.CharField(choices=[('hs', 'Houses'), ('ma', 'Manufactured'), ('mf', 'Multi-family'), ('ap', 'Apartment'), ('ll', 'Lots/Land'), ('th', 'Townhomes')], max_length=5)),
                ('is_furnished', models.BooleanField(default=False)),
                ('has_swimming_pool', models.BooleanField(default=False)),
                ('has_heating_and_colling', models.BooleanField(default=False)),
                ('balconies_number', models.PositiveIntegerField(default=0)),
                ('bedrooms_number', models.PositiveIntegerField(default=0)),
                ('bathrooms_number', models.PositiveIntegerField(default=0)),
                ('parking_spaces_number', models.PositiveIntegerField(default=0)),
                ('garages_number', models.PositiveIntegerField(default=0)),
                ('floor_space', models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
                ('status', models.CharField(choices=[('uk', 'Under checking'), ('fs', 'For sale'), ('uc', 'Under contract'), ('sa', 'saled')], default='uk', max_length=2)),
                ('is_verified', models.BooleanField(default=False)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('images', models.ManyToManyField(related_name='property_image', to='home_seller_app.Image')),
                ('location', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Location')),
                ('main_image', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Image')),
                ('owner', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Owner')),
            ],
        ),
        migrations.CreateModel(
            name='UserVerification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=30, unique=True)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_verification', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserResetVerification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=30, unique=True)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_reset', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Suggestions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('property', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Property')),
                ('suggestions', models.ManyToManyField(blank=True, related_name='property_suggestions', to='home_seller_app.Property')),
            ],
        ),
        migrations.CreateModel(
            name='Street',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('latitude', models.DecimalField(decimal_places=8, max_digits=15, null=True)),
                ('longitude', models.DecimalField(decimal_places=8, max_digits=15, null=True)),
                ('is_verified', models.BooleanField(default=False)),
                ('search_vector', django.contrib.postgres.search.SearchVectorField(null=True)),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.City')),
            ],
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=2)),
                ('name', models.CharField(max_length=100)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Country')),
            ],
        ),
        migrations.AddField(
            model_name='location',
            name='street',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Street'),
        ),
        migrations.CreateModel(
            name='InCharge',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_from', models.DateField()),
                ('date_to', models.DateField()),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('agent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Agent')),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Property')),
            ],
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('uc', 'Under consideration'), ('a', 'Accepted'), ('d', 'Denied')], max_length=2)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('agent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Agent')),
                ('client', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Client')),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Property')),
            ],
        ),
        migrations.AddField(
            model_name='city',
            name='state',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.State'),
        ),
        migrations.AddField(
            model_name='agent',
            name='city',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.City'),
        ),
        migrations.AddField(
            model_name='agent',
            name='image',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Image'),
        ),
        migrations.CreateModel(
            name='UserBookmark',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_seller_app.Property')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_bookmarks', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'property')},
            },
        ),
        migrations.AddIndex(
            model_name='street',
            index=django.contrib.postgres.indexes.GinIndex(fields=['search_vector'], name='home_seller_search__9f8fbe_gin'),
        ),
        migrations.AlterUniqueTogether(
            name='street',
            unique_together={('city', 'name')},
        ),
        migrations.AlterUniqueTogether(
            name='contact',
            unique_together={('property', 'client')},
        ),
    ]
