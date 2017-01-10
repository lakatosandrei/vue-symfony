name             "test-vm"
maintainer       "Janusz Grabis"
maintainer_email "janusz@rsi.pl"
license          "All rights reserved"
description      "Installs/Configures app server env"
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          "0.0.1"

#depends "java", "~> 1.22.0" 
recipe "test-vm", "Installs App server environment"

