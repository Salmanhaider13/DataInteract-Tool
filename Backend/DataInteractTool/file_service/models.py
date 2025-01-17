from django.db import models
from django.contrib.auth.models import User

class UploadedFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to the user who uploaded the file
    file = models.FileField(upload_to='uploads/')  # File upload field
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when the file was uploaded
    
    def __str__(self):
        return f"{self.file.name}  uploaded by  {self.user.username}  on  {self.uploaded_at.strftime('%Y-%m-%d %H:%M:%S')}"

