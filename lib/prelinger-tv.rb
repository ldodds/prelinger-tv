require 'rubygems'
require 'sinatra/base'
require 'kasabi'

class PrelingerTV < Sinatra::Base

  helpers do
    include Rack::Utils
    alias_method :h, :escape_html        
    def category_from_date(date)
      #year
      if date.match(/([0-9]{4})/)
        return date.match(/([0-9]{4})/)[1][0..2] + "0s"
      end
    end
  end
    
  QUERY = <<-EOL 
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX dcterms: <http://purl.org/dc/terms/>
  PREFIX p: <http://data.kasabi.com/dataset/prelinger-archives/schema/>
  
  SELECT ?src ?title ?description ?depiction ?sponsor ?published WHERE {
    ?src dcterms:format <http://data.kasabi.com/dataset/prelinger-archives/format/512kb-mpeg4>;
         dcterms:isVersionOf ?film.
         
    ?film dcterms:title ?title;
          foaf:depiction ?depiction;
          dcterms:description ?description;
    #      p:sponsor ?org;
          dcterms:published ?published.
    
    #?org foaf:name ?sponsor.          
  }
  
EOL
  
  #Configure application level options
  configure do |app|
    set :static, true    
    set :views, File.dirname(__FILE__) + "/../views"
    set :public, File.dirname(__FILE__) + "/../public"
    set :apikey, ENV["KASABI_API_KEY"]
    enable :xhtml        
  end

  get "/" do
    @channel = "prelinger-archives"
    @dataprovider = "/#{@channel}/data.js"    
    erb :channel
  end

  get "/:channel/data.js" do
    @channel = params[:channel]
    @dataset = Kasabi::Dataset.new("http://data.kasabi.com/dataset/#{@channel}", {:apikey => settings.apikey} )
    endpoint = @dataset.sparql_endpoint_client()
    
    @results = endpoint.select(QUERY)
    
    @categories = []
    @results["results"]["bindings"].each do |result|
      if result["published"]
        category = category_from_date( result["published"]["value"] )
          if !@categories.include?(category)
            @categories << category
          end          
      end
    end
    @categories.sort!
    @categories = @categories.map {|x| "\"#{x}\"" }.join(",")
      
    @videos = []
    @results["results"]["bindings"].each do |result|
      @videos << {
        :src => result["src"]["value"],
        :title => result["title"]["value"],
        :sub => result["published"]["value"],
        :desc => result["description"]["value"],
        :thumb => result["depiction"]["value"],
        :category => category_from_date( result["published"]["value"] )
      }
    end
    @videos = @videos.to_json
    content_type "application/javascript"
    erb :dataprovider
  end  
  
    
end  