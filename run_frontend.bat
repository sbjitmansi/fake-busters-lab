
@echo off
echo Starting FakeBuster frontend in development mode...
echo.
echo This will start only the frontend without the Flask backend.
echo The frontend will be available at http://localhost:8080
echo.
echo Press Ctrl+C to stop the frontend server when you're done.
echo.

call npm run dev
pause
