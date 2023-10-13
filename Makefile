all:
	nohup npm run start > /dev/null 2>&1 &

tail:
	tail -f /var/log/apartment-bot/cron-job.log
