all:
	test -d /var/log/apartment-bot && sudo mkdir -p /var/log/apartment-bot && sudo chown -R ubuntu:ubuntu /var/log/apartment-bot
	nohup npm run start > /dev/null 2>&1 &

tail:
	tail -f /var/log/london-apartment-bot/cron-job.log
