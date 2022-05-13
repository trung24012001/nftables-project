select distinct r.id as rule_id_1, tb.rule_id as rule_id_2
from (
select 
	src.host as ip_src, 
	dst.host as ip_dst, 
	psrc.port as port_src, 
	pdst.port as port_dst, 
	prot.protocol as protocol, 
--	r.policy as action, 
--	r.handle as handle, 
	r.id as rule_id, 
--	tables.family,
--	tables.name as "table",
--	chains.name as chain, 
	chains.hook as hook 
from rules r 
	join ip_src src on r.id = src.rule_id
	join ip_dst dst on r.id = dst.rule_id
	join port_src psrc on r.id = psrc.rule_id
	join port_dst pdst on r.id = pdst.rule_id 
	join protocols prot on r.id = prot.rule_id
	join chains on r.chain_id = chains.id
--	join tables on chains.table_id = tables.id
where chains.type = "filter"
) tb, rules r
	join ip_src src on r.id = src.rule_id
	join ip_dst dst on r.id = dst.rule_id
	join port_src psrc on r.id = psrc.rule_id
	join port_dst pdst on r.id = pdst.rule_id 
	join protocols prot on prot.rule_id = r.id
	join chains on chains.id = r.chain_id
	join tables on chains.table_id = tables.id
where 
	(src.host = tb.ip_src or tb.ip_src = '*' or src.host = '*') and 
	(dst.host = tb.ip_dst or tb.ip_dst = '*' or dst.host = '*') and 
	(psrc.port = tb.port_src or tb.port_src = '*' or psrc.port = '*') and 
	(pdst.port = tb.port_dst or tb.port_dst = '*' or pdst.port = '*') and 
	(prot.protocol = tb.protocol or tb.protocol = '*' or prot.protocol = '*') and
	r.id != tb.rule_id and
	chains.type = "filter" and
	chains.hook = tb.hook;
