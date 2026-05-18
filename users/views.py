from django.shortcuts import render, redirect
from .forms import RegisterForm

def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)

            # lecturer needs approval
            if user.role == "lecturer":
                user.is_approved = False
            else:
                user.is_approved = True

            user.set_password(form.cleaned_data["password"])
            user.save()

            return redirect("login")
    else:
        form = RegisterForm()

    return render(request, "users/register.html", {"form": form})

from django.contrib.auth import authenticate, login

from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from courses.models import Course

def login_view(request):
    error = None

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.role == "lecturer" and not user.is_approved:
                error = "Lecturer not approved yet."
            else:
                login(request, user)

                return redirect("student_courses")

        else:
            error = "Invalid credentials"

    return render(request, "users/login.html", {"error": error})