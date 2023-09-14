# Khadash

Monitoring tool & dashboard for Khadas VIM3 devices

> Note: Khadash is currently in development and may not be entirely stable. If you encounter issues or have suggestions for improvement, please feel free to [report them](https://github.com/burakarslan8/khadash/issues). Your feedback is important!

> Note: If you would like to use Khadash outside of your home network, you can create a [TwinGate](https://www.twingate.com/) connector in your Khadas.


## Prerequisites
- Node.js
- Docker
- Khadas VIM3 SBC

## Installation
1. Pull the Docker image:
```
docker pull burakarslan8/khadash
```

2. Run the Docker container with the following arguments:
```
docker run -d -p 1024:1024 --restart always --privileged burakarslan8/khadash
```

3. The dashboard should now be accessible at:
```
http://localhost:1024
```
Make sure to replace `localhost` with the appropriate hostname or IP address if needed.
