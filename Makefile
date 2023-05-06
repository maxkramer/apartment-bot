all:
	nohup npm run start > /dev/null 2>&1 &

tail:
	tail -f /var/log/london-apartment-bot/cron-job.log
