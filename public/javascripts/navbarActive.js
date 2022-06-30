const navbar = document.querySelectorAll('.navbar-nav')
const path = window.location.pathname
const navbarlinkArr = []

for(let i = 0;i<navbar.length;i++)
    for(let j = 0; j<navbar[i].children.length;j++)
        navbarlinkArr.push(navbar[i].children[j].querySelector('.nav-link'))


for(let j = 0;j<navbarlinkArr.length;j++)
{
    if(navbarlinkArr[j].classList.contains('active'))
        navbarlinkArr[j].classList.remove('active')
}
if(path==='/')
{
    navbarlinkArr[0].classList.add('active')
}
else
for(let i = 0;i<navbarlinkArr.length;i++)
    {
            let index = navbarlinkArr[i].href.search(path)
            if(index !==-1 && navbarlinkArr[i].href.slice(index)===path)
            {
                navbarlinkArr[i].classList.add('active')
            }
    }