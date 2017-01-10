#
# Cookbook Name:: test-vm
# Recipe:: default
#
# janusz@rsi.pl


#------------------------------------------------------------
#PostgreSQL
execute "apt-update" do
  command "sudo apt-get update"
  action :run
  cwd "/root"
end

execute "Install PostgreSQL server" do
  command "sudo apt-get -y install postgresql"
  action :run
  cwd "/root"
end


execute "Install PHP" do
  command "sudo apt-get -y install php5 libapache2-mod-php5 php5-mcrypt php5-curl"
  action :run
  cwd "/root"
end

execute "Install PHP PSQL driver" do
  command "sudo apt-get -y install php5-pgsql"
  action :run
  cwd "/root"
end

execute "Install PHP GD library" do
  command "sudo apt-get -y install php5-gd"
  action :run
  cwd "/root"
end

#------------------------------------------------------------
#Apache

execute "Install Apache" do
  command "sudo apt-get -y install apache2"
  action :run
  cwd "/"
end

directory "/var/www/site" do
  owner 'www-data'
  group 'www-data'
  mode '0655'
  action :create
  recursive true
end

execute "chmod /var/www/site" do
  command "sudo chown -R www-data:www-data /var/www/site"
end 

template '/etc/apache2/sites-available/site.conf' do
  source 'site.conf'
  mode 0644
end

execute "Delete default apache configuration" do
  command "sudo rm -f /etc/apache2/sites-enabled/000-default.conf"
  action :run
  cwd '/root'
end


execute "Delete current configuration if exists" do
  command "sudo rm -f /etc/apache2/sites-enabled/site.conf"
  action :run
  cwd '/root'
end

link '/etc/apache2/sites-enabled/site.conf' do
  to '/etc/apache2/sites-available/site.conf'
end

template '/etc/apache2/ports.conf' do
  source 'ports.conf'
  mode 0644
end

#TODO change this to a2enmod
execute "Delete current rewrite.load link" do
  command "sudo rm -f /etc/apache2/mods-enabled/rewrite.load"
  action :run
  cwd '/root'
end

link '/etc/apache2/mods-enabled/rewrite.load' do
  to '/etc/apache2/mods-available/rewrite.load'
end

#TODO change this to a2enmod
execute "Delete current headers.load link" do
  command "sudo rm -f /etc/apache2/mods-enabled/headers.load"
  action :run
  cwd '/root'
end

link '/etc/apache2/mods-enabled/headers.load' do
  to '/etc/apache2/mods-available/headers.load'
end

execute "Enable proxy mod" do
  command 'sudo a2enmod -q proxy'
  action :run
  cwd '/root'
end

execute "Enable proxy_http mod" do
  command 'sudo a2enmod -q proxy_http'
  action :run
  cwd '/root'
end

#Apache
#------------------------------------------------------------


#------------------------------------------------------------
#Symfony


execute "Download symfony tool" do
  command 'sudo curl -LsS https://symfony.com/installer -o /usr/local/bin/symfony'
  action :run
  cwd '/root'
end

execute "Set permissions for symfony" do
  command 'sudo chmod a+x /usr/local/bin/symfony'
  action :run
  cwd '/root'
end

execute "Remove /var/www/site" do
  command 'rm -rf /var/www/site'
  action :run
  cwd '/root'
end

execute "Init symfony project" do
  command 'sudo symfony new site'
  action :run
  cwd '/var/www'
end

execute "Make www-data owner of site" do
  command 'sudo chown -R www-data:www-data /var/www/site'
  action :run
  cwd '/root'
end



#Symfony
#------------------------------------------------------------








execute "Restart apache2" do
  command "sudo /etc/init.d/apache2 restart"
  action :run
  cwd "/root"
end


