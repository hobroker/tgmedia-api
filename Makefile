help: ## Show this help message
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

update-api: ## Update api
	cd charts/tgmedia-api; \
    	  helm dependency update; \
    	  helm upgrade --install tgmedia-api .

.PHONY: help
