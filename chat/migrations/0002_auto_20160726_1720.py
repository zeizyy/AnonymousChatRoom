# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='msg',
            new_name='text',
        ),
        migrations.AddField(
            model_name='message',
            name='chatroom',
            field=models.ForeignKey(default=1, to='chat.ChatRoom'),
            preserve_default=False,
        ),
    ]
