Funbrella.messageBoard = Funbrella.WidgetView.extend(
  config:
    fetch: false

  template: Hogan.compile("<h1 class=\"clock\">{{time}}</h1><ul class=\"message-list\">{{#messages}}<li class=\"{{type}}\">{{#sender}}<strong>{{sender}}:</strong> {{/sender}}{{{content}}}</li>{{/messages}}</ul>")
  send: (message) ->
    stick = message.stickFor or 0
    message.timestamp = @stickyFor(new Date(), stick)
    m = @collection.push(message)

  init: ->
    @doFetch = false
    @collection.comparator = (message) ->
      -message.get("timestamp").getTime()

    console.log 'MESSSSSAGE', @el
    @addMessageForm()

  data: (data, cb) ->
    @collection.sort()
    cb
      time: @getTime()
      messages: @collection.toJSON()


  stickyFor: (date, minutes) ->
    new Date(date.getTime() + minutes * 60000)

  getTime: (time) ->
    time = time or new Date()
    date = new Date(time)
    hour = date.getHours()
    minutes = date.getMinutes()
    hour = hour - 12  if hour > 12
    String::fatten = ->
      if this < 10
        "0" + this
      else
        this

    time = hour.toString().fatten() + ":" + minutes.toString().fatten()
    time = time + date.getSeconds().toString().fatten()  if @prefs.showSeconds
    time

  messageTemplate: Hogan.compile("<div id=\"message\"><textarea placeholder=\"send a message.\"></textarea><div><label for=\"sticky\">Stick for</label><input name=\"sticky\" value=\"0\"></div><a class=\"send btn\">send</a></div>")
  addMessageForm: ->
    $("body").append @messageTemplate.render()
    $("#message .send").click ->
      sock.socket.send JSON.stringify(
        content: $("#message textarea").val()
        stickFor: $("#message input[name=sticky]").val()
      )
      $("#message textarea").val ""

)
