echo "Starting dji-web"
while true
do
	sudo node /home/pi/dji-web/index.js
	echo "dji-web crashed, restarting!"
done
