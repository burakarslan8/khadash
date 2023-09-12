# Khadash

Monitoring tool & dashboard for Khadas VIM3 devices

> Note: Khadash is currently in development and may not be entirely stable. If you encounter issues or have suggestions for improvement, please feel free to [report them](https://github.com/burakarslan8/khadash/issues). Your feedback is important!


## Prerequisites
- Node.js
- Docker
- Khadas VIM3 SBC

## Installation

1. Clone the repository:
```
git clone https://github.com/burakarslan8/khadash.git
```

2. Navigate to the project directory:
```
cd khadash
```

3. Build the Docker image:
```
docker build -t khadash .
```

4. Run the Docker container with the following arguments:
```
docker run -d -p 1024:1024 --restart always --privileged khadash
```

5. The dashboard should now be accessible at:
```
http://localhost:1024
```
Make sure to replace `localhost` with the appropriate hostname or IP address if needed.
