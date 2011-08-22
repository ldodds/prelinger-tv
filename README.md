PRELINGER TV
---------

This is an experiment at creating a Google TV channel based on data stored in Kasabi[0]

The code is based on an experiment originally carried out by Liam Green-Hughes which adapted 
a Google TV template to load data using SPARQL queries. See:

[An HTML5 Leanback TV webapp that brings SPARQL to your living room][1]

The code has been adapted to use the Prelinger Archives data stored in Kasabi[2]. 

The code performs a SPARQL query to extract some basic metadata about each of the films that 
are described in the dataset. The actual media files are stored on the Internet Archive 
servers.

AUTHOR
------

Leigh Dodds (ld@kasabi.com)

INSTALLATION
------------

The application is a very simple Sinatra application. It's dependent on the Kasabi.rb ruby gem[3]. 

You need to configure your Kasabi API key in the KASABI_API_KEY environment variable before it 
will run. You should then be able to do:

rackup


[0]: [http://kasabi.com]
[1]: [http://www.greenhughes.com/content/html5-leanback-tv-webapp-brings-sparql-living-room] 
[2]: [http://beta.kasabi.com/dataset/prelinger-archives]
[3]: [http://github.com/kasabi/kasabi.rb]