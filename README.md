PRELINGER TV
---------

This is an experiment at creating a [Google TV][4] channel based on data stored in Kasabi[0].

The code is based on an experiment originally carried out by Liam Green-Hughes who adapted one 
of the off-the-shelf Google TV templates to load data using a SPARQL query. For more background on 
that see Liam's blog post:

[An HTML5 Leanback TV webapp that brings SPARQL to your living room][1]

Starting from the same template, this application builds a similar channel but using 
the [Prelinger Archives][2] data stored in Kasabi, rather than from the Open University. 

The code performs a single SPARQL query to extract the basic metadata about each of the films described 
in the dataset, grouping them into categories for each decade. 

The actual media files are stored on the Internet Archive servers and are streamed directly to the 
browser from there.

The code could easily be adapted to use additional, similarly constructed datasets. The code 
to crawl the Prelinger Archives collection on on the Internet Archives can be found at:

[http://github.com/ldodds/prelinger-archives][5]

AUTHOR
------

Leigh Dodds (ld@kasabi.com)

INSTALLATION
------------

The application is a very simple Sinatra application. It's dependent on the [Kasabi.rb][3] ruby gem. 

You need to configure your Kasabi API key in the KASABI_API_KEY environment variable before it 
will run. You should then be able to just:

	rackup

[0]: [http://kasabi.com]
[1]: [http://www.greenhughes.com/content/html5-leanback-tv-webapp-brings-sparql-living-room] 
[2]: [http://beta.kasabi.com/dataset/prelinger-archives]
[3]: [http://github.com/kasabi/kasabi.rb]
[4]: [http://www.google.com/tv/]
[5]: [http://github.com/ldodds/prelinger-archives]