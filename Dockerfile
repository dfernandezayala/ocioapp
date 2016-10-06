# This is a comment
FROM registry.ng.bluemix.net/ibmnode:latest
MAINTAINER Diego Fernández <difernan@pe.ibm.com>
RUN mkdir /nodeocio
ADD ./* /nodeocio/
WORKDIR /nodeocio
RUN npm install express cheerio request
EXPOSE 8081
CMD ["./start.sh"]
