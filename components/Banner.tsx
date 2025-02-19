const banner = {
  backgroundImage:
"linear-gradient(90deg, #0162FF 0%, #FFFFFF 49.7%, #0162FF 100%)",
};

const Banner = () => {
  return (
    <div style={banner} className='py-4 w-full text-[#0162FF] text-center lg:text-xl md:text-xl text-sm'>
      Erebrus App Apk is live now,&nbsp;
      <span className='text-bold text-black'>Download here</span>
      &nbsp;&#10138;
    </div>
  );
};

export default Banner;
