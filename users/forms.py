from django import forms
from .models import User

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        # fields = ['username', 'email', 'password', 'role']
        fields = [
            'first_name',
            'last_name',
            'username',
            'email',
            'password',
            'role',
        ]