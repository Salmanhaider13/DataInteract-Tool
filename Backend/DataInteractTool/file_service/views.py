import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import UploadedFile
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import os

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']

        # Check if the file is a CSV
        if not uploaded_file.name.endswith('.csv'):
            return JsonResponse({'error': 'File is not a CSV'}, status=400)

        # Retrieve the session and user
        try:
            session = Session.objects.get(session_key=request.POST.get('session_id'))
            user = User.objects.get(username=session.get_decoded().get('username', ''))
        except (Session.DoesNotExist, User.DoesNotExist):
            return JsonResponse({'error': 'Invalid session or user'}, status=400)

        # Save the uploaded file
        instance = UploadedFile(user=user, file=uploaded_file)
        instance.save()

        # Process the CSV with pandas
        df = pd.read_csv(instance.file.path)

        # Convert DataFrame to JSON
        df_json = df.to_json(orient='records')

        # Store the file ID in the session
        session_data = session.get_decoded()
        session_data['file_id'] = instance.id
        # session.set_decoded(session_data)

        return JsonResponse({
            'message': 'File uploaded successfully',
            'file_id': session_data['file_id'],
            'data': json.loads(df_json)  # Parse the JSON string into a Python dict
        })

    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt  # Temporarily disable CSRF for testing; use with caution in production
def preprocess_data(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request
            body = json.loads(request.body)
            options = body.get('options', {})
            data = body.get('data', [])

            # Convert the data to a pandas DataFrame for processing
            df = pd.DataFrame(data)

            # Drop rows with any NaN values if specified
            if options.get('dropna', False):
                df.dropna(inplace=True)

            # Remove outliers using the IQR method
            if options.get('remove_outliers', False):
                for column in df.select_dtypes(include=['float64', 'int64']).columns:
                    Q1 = df[column].quantile(0.25)
                    Q3 = df[column].quantile(0.75)
                    IQR = Q3 - Q1
                    lower_bound = Q1 - 1.5 * IQR
                    upper_bound = Q3 + 1.5 * IQR
                    df = df[(df[column] >= lower_bound) & (df[column] <= upper_bound)]

            # Convert the processed DataFrame back to a list of dictionaries
            processed_data = df.to_dict(orient='records')

            return JsonResponse({'data': processed_data}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt  # Use with caution
def correlation_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            uploaded_data = data.get('data', None)

            if uploaded_data is None:
                return JsonResponse({'error': 'No data provided'}, status=400)

            # Convert uploaded data to a DataFrame
            df = pd.DataFrame(uploaded_data)

            # Calculate the correlation matrix
            correlation_matrix = df.corr(numeric_only=True)

            # Convert the correlation matrix to a list of dictionaries for JSON serialization
            correlation_dict = correlation_matrix.to_dict()
            response_data = []

            for feature, correlations in correlation_dict.items():
                row_data = {'feature': feature}
                row_data.update(correlations)
                response_data.append(row_data)

            # Extract numeric feature names
            numeric_features = list(df.select_dtypes(include='number').columns)

            # Combine the correlation data and features into a single response
            response = {
                'corr': response_data,
                'features': numeric_features
            }

            return JsonResponse(response, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)


@csrf_exempt  # Consider using CSRF tokens for security in production
def train_model(request):
    if request.method == 'POST':
        try:
            # Parse the JSON payload from the request
            data = json.loads(request.body)
            model_type = data.get('model')
            target = data.get('target')
            feature = data.get('feature')
            split_ratio = data.get('split_ratio', 0.8)
            input_data = data.get('data')

            # Convert input data into a pandas DataFrame
            df = pd.DataFrame(input_data)

            # Check if feature and target are in the DataFrame
            if feature not in df.columns or target not in df.columns:
                return JsonResponse({'error': 'Feature or target column not found in data'}, status=400)

            # Prepare features and target variable
            X = df[[feature]]  # Features
            y = df[target]     # Target variable

            # Train-Test Split
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1 - float(split_ratio), random_state=42)

            # Train the model based on the selected type
            if model_type == 'linear_regression':
                model = LinearRegression()
                model.fit(X_train, y_train)

                # Make predictions and calculate MSE and R²
                predictions = model.predict(X_test)
                mse = mean_squared_error(y_test, predictions)
                r2 = r2_score(y_test, predictions)

                return JsonResponse({
                    'message': 'Model trained successfully',
                    'mse': mse,
                    'r2': r2,
                    'predicted_data': predictions.tolist(),  # Convert to list for JSON serialization
                    'X_test': X_test.values.tolist(), # Convert to list for JSON serialization
                    'X': X.values.tolist(),  # Convert to list for JSON serialization
                    'y': y.tolist() # Convert to list for JSON serialization
                }, status=200)
            else:
                return JsonResponse({'error': 'Unsupported model type'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
