help: ## Show this help message
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

update-db: ## Update db
	cd charts/tgmedia-db; \
    	  helm dependency update; \
    	  helm upgrade --install tgmedia-db .

update-api: ## Update api
	cd charts/tgmedia-api; \
    	  helm dependency update; \
    	  helm upgrade --install tgmedia-api .

.PHONY: help
