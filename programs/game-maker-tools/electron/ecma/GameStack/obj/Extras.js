
Quick2d.Extras =  {

    call(items)
    {
        if(!(items instanceof Array))
        {

          return console.error('Quick2d.Extras.call(), needs array argument');

        }

        //a callable item can be one-time executed: it will have any of the following functions attached

        for(var x = 0; x < items.length; x++)
        {
            var item = items[x];

            if(typeof(item.engage) == 'function')
            {
                item.engage();

            }

            if(typeof(item.fire) == 'function')
            {
                item.fire();

            }

            if(typeof(item.start) == 'function')
            {
                item.start();

            }

            if(typeof(item.run) == 'function')
            {
                item.run();

            }

            if(typeof(item.process) == 'function')
            {
                item.process();

            }

        }

    }

}










