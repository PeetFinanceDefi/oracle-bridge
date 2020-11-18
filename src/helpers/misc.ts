export default class MiscHelper
{
    public static SleepSeconds(secs: number) {
        return new Promise((resolve) => {
          setTimeout(resolve, secs * 1000);
        });
      } 
      
}